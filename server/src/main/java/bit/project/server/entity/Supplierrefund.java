package bit.project.server.entity;

import lombok.Data;
import java.util.List;
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
public class Supplierrefund{
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
    private Paymenttype paymenttype;

    @ManyToOne
    private Purchase purchase;

    @ManyToOne
    private Paymentstatus paymentstatus;

    @OneToMany(mappedBy="supplierrefund", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Supplierrefundmaterial> supplierrefundmaterialList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Supplierrefund(Integer id){
        this.id = id;
    }

    public Supplierrefund(Integer id, String code, Purchase purchase, String chequeno, String chequebank){
        this.id = id;
        this.code = code;
        this.purchase = purchase;
        this.chequeno = chequeno;
        this.chequebank = chequebank;
    }

}