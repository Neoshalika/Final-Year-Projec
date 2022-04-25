package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
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
public class Delivery{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String contactname;

    private String contactno;

    private String permitno;

    private Integer distance;

    @Lob
    private String address;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Customerorder customerorder;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private Deliverystatus deliverystatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @ManyToMany
        @JoinTable(
        name="deliveryemployee",
        joinColumns=@JoinColumn(name="delivery_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="employee_id", referencedColumnName="id")
    )
    private List<Employee> employeeList;


    public Delivery(Integer id){
        this.id = id;
    }

    public Delivery(Integer id, String code, Customerorder customerorder, String contactname, String contactno){
        this.id = id;
        this.code = code;
        this.customerorder = customerorder;
        this.contactname = contactname;
        this.contactno = contactno;
    }

}