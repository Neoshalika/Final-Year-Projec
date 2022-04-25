package bit.project.server.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Customerpayment{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    private BigDecimal amount;

    private String chequeno;

    private String chequebank;

    private String chequebranch;

    private LocalDate chequedate;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Customerorder customerorder;

    @ManyToOne
    private Paymenttype paymenttype;

    @ManyToOne
    private Paymentstatus paymentstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Customerpayment(Integer id){
        this.id = id;
    }

    public Customerpayment(Integer id, String code, Customerorder customerorder, Paymenttype paymenttype, String chequeno){
        this.id = id;
        this.code = code;
        this.customerorder = customerorder;
        this.paymenttype = paymenttype;
        this.chequeno = chequeno;
    }

}